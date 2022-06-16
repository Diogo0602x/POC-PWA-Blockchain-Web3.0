#!/bin/sh
#JAVA_HOME=/u01/jdk-11.0.14

BASEDIR=$(dirname "$0")

APP_BASE_NAME="poc-tarea-fhir"
APP_JAR="${BASEDIR}/${APP_BASE_NAME}.war"

LOG_FILE="${BASEDIR}/${APP_BASE_NAME}.out"
PID_FILE="${BASEDIR}/app.pid"

REPO_DIR="${BASEDIR}/local-repo"

start(){
   numproc=`ps -ef | grep $APP_BASE_NAME | grep -v "grep" | grep -v "tail" | wc -l`
   
   if [ $numproc -gt 0 ]; then
       printf "Aplicacao esta RODANDO. PID: "
       cat $PID_FILE
       printf "\n"
       exit 1
   fi

   printf "Iniciando o servico...\n"
   nohup $JAVA_HOME/bin/java -Djava.security.egd=file:/dev/./urandom -jar $APP_JAR > $LOG_FILE 2>&1 &
   log
}

stop(){
   printf "Parando a aplicacao... "
   ps axf | grep $APP_BASE_NAME | grep -v grep | awk '{print $1}' | xargs -r kill
   printf "pronto.\n"
}

status(){
    numproc=`ps -ef | grep $APP_BASE_NAME | grep -v "grep $APP_BASE_NAME" | wc -l`
    if [ $numproc -gt 0 ]; then
       printf "A aplicacao esta RODANDO. PID: \n"
       ps axf | grep $APP_BASE_NAME | grep -v grep | grep -v tail | awk '{print "  -  "$1}'
    else
       printf "A aplicacao esta PARADA.\n"
    fi
}

restart(){
   stop
   start
}

forcestop(){
   printf "Forcando a parada da aplicacao... \n"
   ps axf | grep $APP_BASE_NAME | grep -v grep | grep -v tail | awk '{print $1}' | xargs -r kill -9
   printf "Pronto."
}

reset(){
   forcestop
   printf "Apagando o repositorio local '${REPO_DIR}'... \n"
   rm -rf $REPO_DIR
   start
}

log(){
   tail -f $LOG_FILE
}

truncatelog(){
   printf "" > $LOG_FILE
}

# See how we were called.
case "$1" in
start)
   start
   ;;
stop)
   stop
   ;;
status)
   status
   ;;
restart)
   restart
   ;;
forcestop)
   forcestop
   ;;
reset)
   reset
   ;;
log)
   log
   ;;
truncatelog)
   truncatelog
   ;;
*)
   printf $"Uso: $0 {start|stop|status|restart|forcestop|reset|log|truncatelog}\n"
   exit 1
esac
