"""
Pygame 测试程序
"""
import pygame
import sys
import time

print("程序开始运行...")

# 初始化 Pygame
pygame.init()
print("Pygame 已初始化")

# 创建窗口
screen = pygame.display.set_mode((400, 300))
print("窗口已创建")

# 设置标题
pygame.display.set_caption("测试窗口")

# 设置背景色为白色
screen.fill((255, 255, 255))
pygame.display.flip()

# 等待 5 秒
print("窗口将显示 5 秒...")
time.sleep(5)

# 退出
pygame.quit()
print("程序已结束")