#!/bin/bash

usage() {
  echo "Usage: $0 -s <server address> -p <port>" 1>&2;
  echo ""
  echo "E.g. $0 -s 172.24.0.1 -p 80"
  echo ""
  echo "       -s ..... server address"
  echo "       -p ..... forwarded port"
  echo "       -m ..... schema (e.g., http or https)"
  exit 1;
}


while getopts "s:p:m:" opt
do
   case "$opt" in
      s ) SERVER_ADDRESS_TO_BE_REPLACED=$OPTARG ;;
      p ) PORT_TO_BE_REPLACED=$OPTARG ;;
      m ) SCHEMA_TO_BE_REPLACED=$OPTARG ;;
      ? ) usage ;;
   esac
done

if [ -z "$SERVER_ADDRESS_TO_BE_REPLACED" ] || [ -z "$PORT_TO_BE_REPLACED" ] 
then
   echo "Some or all of the parameters are empty";
   usage
fi

if [ -z "$SCHEMA_TO_BE_REPLACED" ]  
then
   SCHEMA_TO_BE_REPLACED=http
fi

cp docker-compose.yml.default docker-compose.yml

# fresh installation
echo ">> Fresh installation"
sudo docker system prune --all

echo ">> Injecting server's IP address"
sed -i "s/SERVER_ADDRESS_TO_BE_REPLACED/$SERVER_ADDRESS_TO_BE_REPLACED/g" ./docker-compose.yml
echo ">> Injecting forwarded port"
sed -i "s/PORT_TO_BE_REPLACED/$PORT_TO_BE_REPLACED/g" ./docker-compose.yml
echo ">> Injecting schema"
sed -i "s/SCHEMA_TO_BE_REPLACED/$SCHEMA_TO_BE_REPLACED/g" ./docker-compose.yml

echo ">> Create empty folders"
sudo chown -R $USER:$USER data/postgresql
mkdir -p data/postgresql/pg_tblspc 
mkdir -p data/postgresql/pg_replslot
mkdir -p data/postgresql/pg_twophase
mkdir -p data/postgresql/pg_commit_ts
mkdir -p data/postgresql/pg_stat_tmp
mkdir -p data/postgresql/pg_stat
mkdir -p data/postgresql/pg_logical/snapshots
mkdir -p data/postgresql/pg_logical/mappings

echo ">> Running docker-compose"
sudo docker-compose up --build -d
