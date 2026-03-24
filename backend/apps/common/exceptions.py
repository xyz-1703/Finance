from rest_framework.exceptions import APIException


class DomainValidationError(APIException):
    status_code = 400
    default_detail = "Request validation failed."
    default_code = "domain_validation_error"
