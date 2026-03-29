# Manual migration to recreate Holding table if missing

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0002_alter_portfolio_unique_together_and_more'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
            CREATE TABLE IF NOT EXISTS portfolio_holding (
                id BIGSERIAL PRIMARY KEY,
                portfolio_id BIGINT NOT NULL,
                stock_id BIGINT NOT NULL,
                quantity NUMERIC(18, 4) NOT NULL DEFAULT 0,
                average_buy_price NUMERIC(18, 4) NOT NULL DEFAULT 0,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(portfolio_id, stock_id),
                FOREIGN KEY (portfolio_id) REFERENCES portfolio_portfolio(id) ON DELETE CASCADE,
                FOREIGN KEY (stock_id) REFERENCES stocks_stockmaster(id) ON DELETE CASCADE
            );
            """,
            reverse_sql="DROP TABLE IF EXISTS portfolio_holding CASCADE;"
        ),
    ]
