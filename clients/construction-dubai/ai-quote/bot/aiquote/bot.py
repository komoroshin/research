"""Telegram-бот: инженер присылает видео, голосовые, фото и заметки по объекту, затем /done → КП.

python -m aiquote.bot
"""
from __future__ import annotations

import asyncio
import logging
import os
import time
from pathlib import Path

from dotenv import load_dotenv
from telegram import Update
from telegram.error import BadRequest
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters

from .media import kind_of
from .pipeline import Visit, process, summary_text

log = logging.getLogger("aiquote.bot")

HELP = ("Пришлите по одному объекту:\n"
        "• видео обхода крыши с голосом (говорите размеры, число воронок и кондиционеров, дефекты)\n"
        "• голосовые и фото\n"
        "• текстовые заметки, например адрес\n\n"
        "Когда всё отправлено — /done, пришлю черновик КП и вопросы.\n"
        "/new — начать новый объект, /status — что уже получено.\n\n"
        "Видео лучше снимать в 720p и короткими роликами: Telegram отдаёт боту файлы до 20 МБ.")


def allowed(update: Update) -> bool:
    ids = {x.strip() for x in os.getenv("ALLOWED_USER_IDS", "").split(",") if x.strip()}
    return not ids or str(update.effective_user.id) in ids


def data_dir() -> Path:
    return Path(os.getenv("DATA_DIR", "./data"))


def visit_of(update: Update, ctx: ContextTypes.DEFAULT_TYPE, fresh: bool = False) -> Visit:
    v: Visit | None = ctx.chat_data.get("visit")
    if v is None or fresh:
        wd = data_dir() / str(update.effective_chat.id) / time.strftime("%Y%m%d-%H%M%S")
        wd.mkdir(parents=True, exist_ok=True)
        v = Visit(wd)
        ctx.chat_data["visit"] = v
    return v


async def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not allowed(update):
        return
    visit_of(update, ctx, fresh=True)
    await update.message.reply_text("Aureum Quote. " + HELP)


async def new(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not allowed(update):
        return
    visit_of(update, ctx, fresh=True)
    await update.message.reply_text("Новый объект. Присылайте видео, голосовые, фото и заметки, потом /done.")


async def status(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not allowed(update):
        return
    v = visit_of(update, ctx)
    kinds: dict[str | None, int] = {}
    for f in v.files:
        k = kind_of(f)
        kinds[k] = kinds.get(k, 0) + 1
    await update.message.reply_text(
        f"Получено: видео {kinds.get('video', 0)}, аудио {kinds.get('audio', 0)}, "
        f"фото {kinds.get('image', 0)}, заметок {len(v.notes)}.")


async def on_text(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not allowed(update):
        return
    visit_of(update, ctx).notes.append(update.message.text)
    await update.message.reply_text("Заметку записал.")


async def on_media(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not allowed(update):
        return
    m = update.message
    v = visit_of(update, ctx)
    n = len(v.files) + 1
    if m.photo:
        tg, name = m.photo[-1], f"photo_{n:02d}.jpg"
    elif m.video:
        tg, name = m.video, f"video_{n:02d}.mp4"
    elif m.video_note:
        tg, name = m.video_note, f"videonote_{n:02d}.mp4"
    elif m.voice:
        tg, name = m.voice, f"voice_{n:02d}.ogg"
    elif m.audio:
        tg, name = m.audio, f"audio_{n:02d}{Path(m.audio.file_name or '.mp3').suffix or '.mp3'}"
    elif m.document:
        tg, name = m.document, f"doc_{n:02d}{Path(m.document.file_name or '').suffix.lower()}"
    else:
        return
    if m.caption:
        v.notes.append(m.caption)
    try:
        f = await tg.get_file()
    except BadRequest as e:
        if "too big" in str(e).lower():
            await m.reply_text("Файл больше 20 МБ, Telegram не отдаёт его боту. Снимите в 720p или разбейте на части.")
            return
        raise
    path = v.workdir / name
    await f.download_to_drive(path)
    kind = v.add_file(path)
    if not kind:
        path.unlink(missing_ok=True)
        await m.reply_text("Этот формат не поддерживается: нужны видео, аудио или фото.")
        return
    label = {"video": "Видео", "audio": "Голосовое", "image": "Фото"}[kind]
    await m.reply_text(f"{label} получено ({len(v.files)} файлов). Ещё что-то или /done.")


async def done(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not allowed(update):
        return
    v = visit_of(update, ctx)
    if not v.files and not v.notes:
        await update.message.reply_text("Пока ничего не получено. " + HELP)
        return
    msg = await update.message.reply_text("Обрабатываю выезд, обычно 1–2 минуты…")
    try:
        r = await asyncio.to_thread(process, v, log=lambda s: log.info("%s: %s", v.workdir.name, s))
    except Exception as e:  # отдаём инженеру понятную причину, детали в лог
        log.exception("Ошибка обработки %s", v.workdir)
        await msg.edit_text(f"Не получилось собрать КП: {e}")
        return
    await msg.edit_text(summary_text(r))
    with open(r.pdf, "rb") as fh:
        await update.message.reply_document(fh, filename=r.pdf.name, caption="Черновик КП. Проверьте перед отправкой клиенту.")
    visit_of(update, ctx, fresh=True)


def main() -> None:
    load_dotenv()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")
    logging.getLogger("httpx").setLevel(logging.WARNING)
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        raise SystemExit("Нет TELEGRAM_BOT_TOKEN в .env")
    if not os.getenv("ALLOWED_USER_IDS"):
        log.warning("ALLOWED_USER_IDS пуст: ботом может пользоваться кто угодно")
    app = Application.builder().token(token).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", start))
    app.add_handler(CommandHandler("new", new))
    app.add_handler(CommandHandler("status", status))
    app.add_handler(CommandHandler("done", done))
    app.add_handler(MessageHandler(
        filters.PHOTO | filters.VIDEO | filters.VIDEO_NOTE | filters.VOICE | filters.AUDIO | filters.Document.ALL,
        on_media))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, on_text))
    app.run_polling()


if __name__ == "__main__":
    main()
