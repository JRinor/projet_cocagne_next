#!/bin/bash
set -e

# Attendre que PostgreSQL soit prêt
until psql -h "db" -U "$POSTGRES_USER" -c '\q'; do
  >&2 echo "PostgreSQL est indisponible - en attente..."
  sleep 1
done

>&2 echo "PostgreSQL est prêt - exécution du script"

# Exécuter le script init.sql
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -h "db" <<-EOSQL
    \i /docker-entrypoint-initdb.d/init.sql
EOSQL