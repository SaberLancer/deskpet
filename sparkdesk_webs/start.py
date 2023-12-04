# -*- coding: utf-8 -*-
# from sparkdesk_web.core import SparkWeb
from core import SparkWeb
import sys

_cookie = sys.argv[1]
_fd = sys.argv[2]
_GtToken = sys.argv[3]

sparkWeb = SparkWeb(
    cookie=_cookie,
    fd=_fd,
    # ChatID="103214150",
    GtToken=_GtToken
)

sparkWeb.create_continuous_chat()
print(sparkWeb._SparkWeb__chat_id)

# instance = None


# def init_instance():
#     global instance
#     print('111', instance)
#     # 获取命令行参数
#     _cookie = sys.argv[1]
#     _fd = sys.argv[2]
#     _GtToken = sys.argv[3]

#     if instance is None:
#         instance = SparkWeb(
#             cookie=_cookie,
#             fd=_fd,
#             # ChatID="103214150",
#             GtToken=_GtToken
#         )

#     # 请根据自己配置三个参数
#     # sparkWeb = SparkWeb(
#     #     cookie=_cookie,
#     #     fd=_fd,
#     #     # ChatID="103214150",
#     #     GtToken=_GtToken
#     # )
#     return instance


# def main():
#     sparkweb_instance = init_instance()
#     chat = sparkweb_instance.create_continuous_chat()
#     print(sparkweb_instance._SparkWeb__chat_id)


# if __name__ == "__main__":
#     main()
