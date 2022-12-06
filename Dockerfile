FROM node:alpine

ARG USERNAME
ARG PASSWORD

RUN adduser -D -h /home/${USERNAME} ${USERNAME} -s /bin/sh && \
    echo -e "${PASSWORD}\n${PASSWORD}" | passwd ${USERNAME} && \
    cd /home/${USERNAME} && \
    mkdir cryptolottery && \
    chown -R ${USERNAME} .

USER ${USERNAME}
WORKDIR /home/${USERNAME}/cryptolottery

COPY public src package.json package-lock.json ./

RUN npm install

CMD ["npm", "run", "start"]

ENTRYPOINT ["/bin/sh"]
