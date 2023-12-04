# -*- coding: utf-8 -*-
# from sparkdesk_web.core import SparkWeb
from core import SparkWeb
import sys

# 获取命令行参数
position = sys.argv[1]
_cookie = sys.argv[2]
_fd = sys.argv[3]
_GtToken = sys.argv[4]
_chat_id = sys.argv[5]

# 请根据自己配置三个参数
sparkWeb = SparkWeb(
    cookie=_cookie,
    fd=_fd,
    GtToken=_GtToken,
    ChatID=_chat_id,
)

chat = sparkWeb.create_continuous_chat()
# print('start', chat)
# chat.chat("肇庆是一个什么样的城市")
# chat.chat(position)
# sparkWeb.chat("repeat: 肇庆是一个什么样的城市")
# sparkWeb.chat_stream()
chat.chat(position)
