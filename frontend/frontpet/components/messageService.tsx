// // src/services/MessageService.js

// import { notification, message } from "antd";

// /**
//  * Displays a message or notification based on the type provided.
//  * @param {string} type - Type of the message ('success', 'error', 'info').
//  * @param {string} content - The content of the message.
//  * @param {Object} [options] - Additional options for the message or notification.
//  */
// const MessageService = (type, content, options = {}) => {
//   const notificationTypes = ["success", "error", "info"];
//   const messageTypes = ["success", "error", "info"];

//   if (notificationTypes.includes(type)) {
//     notification[type]({
//       message: type.charAt(0).toUpperCase() + type.slice(1), // Capitalizes the type (e.g., "Success")
//       description: content,
//       placement: "topRight",
//       ...options,
//     });
//   } else if (messageTypes.includes(type)) {
//     const duration = options.duration || 3;
//     message[type](content, duration);
//   } else {
//     console.warn(
//       `Unsupported type: ${type}. Use one of ${[
//         ...notificationTypes,
//         ...messageTypes,
//       ].join(", ")}.`
//     );
//   }
// };

// export default MessageService;
