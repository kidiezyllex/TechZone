import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@mdi/react';
import { mdiCart } from '@mdi/js';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, UserButton, useUser as useClerkUser } from '@clerk/clerk-react';
import { useUser } from '@/context/useUserContext';
import AccountDropdown from './AccountDropdown';
import { useCartStore } from '@/stores/useCartStore';
import CartSheet from '../ui/CartSheet';

const tabs = [
    { text: 'Trang chủ', href: '/' },
    { text: 'Sản phẩm', href: '/products' },
    { text: 'Giới thiệu', href: '/about-us' },
];

interface TabProps {
    text: string;
    selected: boolean;
    setSelected: (text: string) => void;
}

const Tab = ({ text, selected, setSelected }: TabProps) => {
    return (
        <button
            onClick={() => setSelected(text)}
            className={`${selected
                ? 'text-white'
                : 'text-maintext hover:text-maintext dark:hover:text-gray-100'
                } relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors`}
        >
            <span className="relative z-10">{text}</span>
            {selected && (
                <motion.span
                    layoutId="tab"
                    transition={{ type: 'spring', duration: 0.4 }}
                    className="absolute inset-0 z-0 rounded-sm bg-primary/80"
                ></motion.span>
            )}
        </button>
    );
};
export const NavigationBar = () => {
    const [selected, setSelected] = useState<string>(tabs[0].text);
    const { isAuthenticated, user } = useUser();
    const { user: clerkUser } = useClerkUser();
    const { totalItems } = useCartStore();
    const checkPath = () => {
        const currentPath = window.location.pathname;
        const activeTab = tabs.find(tab => tab.href === currentPath);
        if (activeTab) {
            setSelected(activeTab.text);
        }
    };
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        checkPath();
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm py-3">
            <div className="container mx-auto flex items-center justify-between">
                <a href="/" className="flex items-center">
                    <img
                        draggable="false"
                        src="/images/logo.png"
                        alt="logo"
                        width={100}
                        height={100}
                        className="w-auto mx-auto h-12 select-none cursor-pointer"
                    />
                </a>

                <div className="hidden md:flex items-center space-x-1">
                    {tabs.map((tab) => (
                        <a key={tab.text} href={tab.href}>
                            <Tab
                                text={tab.text}
                                selected={selected === tab.text}
                                setSelected={setSelected}
                            />
                        </a>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <SignedOut>
                        <div className="hidden md:flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.href = '/auth/login'}
                            >
                                <img
                                    src="https://logos-world.net/wp-content/uploads/2025/08/Google-Logo-New.png"
                                    alt="Google"
                                    className="h-4 w-auto"
                                />
                                Đăng nhập với Google
                            </Button>
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <div className="hidden md:flex items-center gap-3">
                            <span className="text-base font-medium text-maintext">
                                Xin chào, <span className='text-primary font-bold'>{clerkUser?.fullName || clerkUser?.firstName || 'Khách hàng'}</span>
                            </span>
                        </div>
                    </SignedIn>
                    <div className="flex items-center gap-3">
                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "h-8 w-8",
                                        userButtonPopoverCard: "shadow-lg",
                                        userButtonPopoverActionButton: "hover:bg-primary/10",
                                    }
                                }}
                                afterSignOutUrl="/"
                            />
                        </SignedIn>
                        <SignedOut>
                            {isAuthenticated && <AccountDropdown />}
                        </SignedOut>
                        <button onClick={() => setIsOpen(true)} className="bg-primary rounded-full relative p-2 text-maintext hover:text-primary transition-colors">
                            <Icon path={mdiCart} size={0.7} className='text-white' />
                            <span className="absolute -top-1 -right-1 bg-extra text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {totalItems}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <CartSheet
                open={isOpen}
                onOpenChange={setIsOpen}
            />
        </header>
    );
};

export default NavigationBar; 