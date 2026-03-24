from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class EmailOrUsernameModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        # We extract identifier from username or email keyword argument
        identifier = kwargs.get('email') or username
        if identifier is None:
            return None
            
        print(f"[Auth Debug] Attempting login for identifier: {identifier}")
        try:
            user = User.objects.get(Q(email=identifier) | Q(username=identifier))
            print(f"[Auth Debug] User found: {user.email} (Username: {user.username})")
        except User.DoesNotExist:
            print(f"[Auth Debug] No user found for: {identifier}")
            return None
            
        if user.check_password(password) and self.user_can_authenticate(user):
            print(f"[Auth Debug] Password correct for: {identifier}")
            return user
        
        print(f"[Auth Debug] Password WRONG or user inactive for: {identifier}")
        return None
