from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.middleware.csrf import CsrfViewMiddleware, get_token


class CookieJWTAuthentication(JWTAuthentication):
    access_cookie = "access_token"

    def authenticate(self, request):
        access_token = request.COOKIES.get(self.access_cookie)
        if not access_token:
            return None

        request.META["HTTP_AUTHORIZATION"] = f"Bearer {access_token}"
        result = super().authenticate(request)
        if result is None:
            return None

        if request.method not in ("GET", "HEAD", "OPTIONS", "TRACE"):
            self._enforce_csrf(request)

        get_token(request)
        return result

    def _enforce_csrf(self, request):
        check = CsrfViewMiddleware(lambda request: None)
        reason = check.process_view(request, None, (), {})
        if reason:
            raise AuthenticationFailed("CSRF validation failed")
