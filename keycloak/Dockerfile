FROM jboss/keycloak:latest

# COPY ./libs/keycloak-bcrypt-1.5.0.jar /opt/jboss/keycloak/standalone/deployments/
COPY ./staging-realm.json /etc/staging-realm.json

# Keycloak config 
# ENV KEYCLOAK_LOGLEVEL DEBUG 
# ENV ROOT_LOGLEVEL DEBUG 
# ENV PROXY_ADDRESS_FORWARDING true 

ENV KEYCLOAK_IMPORT /etc/staging-realm.json 

# Runtime config 
# ENV JAVA_OPTS -server \ 
#   -Xms256m \ 
#   -Xmx2048m \ 
#   -XX:MetaspaceSize=96M \ 
#   -XX:MaxMetaspaceSize=256m \ 
#   -Djboss.modules.system.pkgs=org.jboss.byteman \ 
#   -Djava.awt.headless=true \ 
#   -Djava.net.preferIPv4Stack=true \ 
#   -Dkeycloak.migration.strategy=OVERWRITE_EXISTING \ 
#   -Dkeycloak.profile.feature.upload_scripts=enabled \
#   -Djboss.bind.address=0.0.0.0 \
#   -Djboss.bind.address.private=127.0.0.1

EXPOSE 8080