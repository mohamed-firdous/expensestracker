import React, { useState } from 'react';
import { User, Mail, Save, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsLoading(true);
      setMessage(null);
      
      const success = await updateUser({
        name,
        email,
      });
      
      if (success) {
        setMessage({
          text: 'Profile updated successfully',
          type: 'success',
        });
      } else {
        setMessage({
          text: 'Failed to update profile',
          type: 'error',
        });
      }
    } catch (error) {
      setMessage({
        text: 'An error occurred while updating your profile',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="space-y-6 pb-8">
      <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card variant="bordered">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="mb-4 h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-3xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <button
                  className="absolute bottom-0 right-0 rounded-full bg-primary-600 p-2 text-white shadow-md hover:bg-primary-700"
                  aria-label="Change profile picture"
                >
                  <Camera size={16} />
                </button>
              </div>
              
              <h2 className="mt-2 text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              
              <div className="mt-4 w-full border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-500">
                  <p>Member since</p>
                  <p className="font-medium text-gray-900">January 2025</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card variant="bordered">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Account Information</h2>
            
            {message && (
              <div
                className={`mb-4 rounded-md p-3 ${
                  message.type === 'success' ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
                }`}
              >
                {message.text}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User size={16} />}
                required
              />
              
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={16} />}
                required
              />
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  leftIcon={<Save size={16} />}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
          
          <Card variant="bordered" className="mt-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Account Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-xs text-gray-500">Receive email notifications for expense summaries</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Budget Alerts</h3>
                  <p className="text-xs text-gray-500">Receive alerts when you're close to your budget limit</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Dark Mode</h3>
                  <p className="text-xs text-gray-500">Switch between light and dark mode</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100"></div>
                </label>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;