import { DollarSign, Calendar, Users, MessageCircle, Video } from "lucide-react";

export default function PackInfo() {
  return (
    <div className="max-w-md p-6 bg-white border rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold">Slack Pro</h2>
      <p className="text-gray-500">Billed monthly</p>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-gray-700">
          <MessageCircle className="text-purple-500" size={18} />
          <span>Unlimited message and file history</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="text-purple-500" size={18} />
          <span>Work with people outside your organization</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Video className="text-purple-500" size={18} />
          <span>Group voice and video huddles</span>
        </div>
      </div>
      
      <div className="mt-4 border-t pt-4">
        <div className="flex justify-between text-gray-700">
          <span>$8.75 × 2 members</span>
          <span>$17.50</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Sales tax</span>
          <span>$0.00</span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center font-semibold">
        <div className="flex items-center gap-2">
          <Calendar size={18} />
          <span>Due on 04/09/2025</span>
        </div>
        <span className="text-lg">$17.50 USD</span>
      </div>
      
      <p className="mt-2 text-gray-500">22 days left in trial</p>
      
      <div className="mt-4 p-4 bg-gray-100 rounded-lg text-gray-600 text-sm">
        <p className="font-semibold">This is an estimate.</p>
        <p>You'll be charged based on the number of members on your team on your renewal date. <a href="#" className="text-blue-600">Learn more</a></p>
      </div>
    </div>
  );
}
