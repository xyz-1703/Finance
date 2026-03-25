from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .forecasting_service import get_real_forecasting

@api_view(['GET'])
@permission_classes([AllowAny])
def forecast_view(request):
    """
    Accepts ticker and model (default: 'linear') query parameters.
    Returns historical dates/prices and 30-day future dates/predicted prices.
    """
    ticker = request.query_params.get('ticker', 'BTC')
    model_type = request.query_params.get('model', 'linear')
    
    # Ensure model is linear if it's the forecast endpoint, 
    # but we'll follow the user's specific request for default.
    result = get_real_forecasting(ticker, model_type)
    return Response(result)

@api_view(['GET'])
@permission_classes([AllowAny])
def prediction_view(request):
    """
    Similar to forecast, defaults to 'logistic' model, 
    returning the classification-based pricing path.
    """
    ticker = request.query_params.get('ticker', 'BTC')
    model_type = request.query_params.get('model', 'logistic')
    
    result = get_real_forecasting(ticker, model_type)
    return Response(result)
