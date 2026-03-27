from django.db import models
from django.conf import settings

class ChatMessage(models.Model):
    SENDER_CHOICES = (
        ("user", "User"),
        ("bot", "Bot"),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="chat_messages")
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.sender} at {self.created_at}"
