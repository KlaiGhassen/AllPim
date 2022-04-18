const { Server } = require("socket.io");

class SocketIO {
  #io = new Server();
  static #instance = new SocketIO();

  constructor() {
    this.#io.on("connection", (socket) => {
      const user_id = socket.handshake.query["user_id"];
      socket.join(user_id);

      socket.on("startTyping", (typeEvent) => {
        this.#io.to(typeEvent.contact_id).emit("contactStartTyping", {
          contact_id: typeEvent.user_id,
          socket_id: socket.id,
        });
      });

      socket.on("stopTyping", (typeEvent) => {
        this.#io.to(typeEvent.contact_id).emit("contactStopTyping", {
          contact_id: typeEvent.user_id,
          socket_id: socket.id,
        });
      });
    });
  }

  attatch(server) {
    this.#io.attach(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
  }

  sendMessage(socket_id, message) {
    this.#io.to(message.to.toString()).emit("newMessage", message);
    const socket = this.#io.sockets.sockets.get(socket_id);
    socket.broadcast
      .to(message.from.toString())
      .emit("newMessageFromMe", message);
  }

  markAllAsReaded(socket_id, contact_id, user_id) {
    this.#io.to(contact_id).emit("markAllAsReaded", user_id);
    const socket = this.#io.sockets.sockets.get(socket_id);
    socket.broadcast.to(user_id).emit("markAllAsReadedFromMe", contact_id);
  }

  markAsReaded(contact_id, user_id, message_id) {
    this.#io
      .to(contact_id)
      .emit("markMessageAsReaded", { contact_id: user_id, message_id });
  }

  markAllAsDelivred(contact_id, user_id) {
    this.#io.to(contact_id).emit("markAllAsDelivred", user_id);
  }

  markAsDelivred(contact_id, user_id, message_id) {
    this.#io
      .to(contact_id)
      .emit("markMessageAsDelivred", { contact_id: user_id, message_id });
  }

  static getInstance() {
    return this.#instance;
  }
}

module.exports = SocketIO;
