from django.contrib.auth import get_user_model
from django.test import TestCase


class UserModelTests(TestCase):
    def test_create_user_with_email(self):
        user = get_user_model().objects.create_user(email="user@example.com", password="pass12345")
        self.assertEqual(user.email, "user@example.com")
        self.assertTrue(user.check_password("pass12345"))
