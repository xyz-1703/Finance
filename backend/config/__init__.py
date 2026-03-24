<<<<<<< HEAD
from .celery import app as celery_app

__all__ = ('celery_app',)
=======
try:
	from .celery import app as celery_app
except ModuleNotFoundError:  # pragma: no cover
	celery_app = None

__all__ = ("celery_app",)
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
