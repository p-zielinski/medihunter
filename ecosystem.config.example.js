module.exports = {
  apps: [
    {
      name: "medihunter-email-sender",
      version: "1.0.0",
      script: "npm run start",
      env: {
        SMTP_AUTH_PASSWORD: "",
        SMTP_AUTH_USER: "",
        MEDIHUNTER_RUN_COMMAND: "",
        EMAIL_ADDRESS: ""
      },
    }
  ],
};
