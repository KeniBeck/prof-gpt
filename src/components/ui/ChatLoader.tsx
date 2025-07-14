import { Avatar, AvatarFallback } from "./Avatar";

const ChatLoader = () => {
  return (
    <div className="flex justify-start">
      <div className="flex space-x-2 sm:space-x-3 max-w-3xl">
        <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
          <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-700 text-white text-xs sm:text-sm">
            M
          </AvatarFallback>
        </Avatar>
        <div className="bg-amber-50/70 border border-gray-200 rounded-lg p-3 sm:p-4">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLoader;
