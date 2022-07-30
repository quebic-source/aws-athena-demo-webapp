import { useEffect, useState } from 'react';
const iconClass = 'feather feather-check-circle w-5 h-5 mx-2';
export default function Message({ type, text, timeout= 5000 }) {
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        if (timeout > 0) {
            setTimeout(()=>{
                setIsOpen(false);
            }, timeout)
        }
    }, []);

    let themeColor;
    let icon;
    if (type === 'success') {
        themeColor = 'green';
        icon = (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={iconClass}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>)
    } else if (type === 'error') {
        themeColor = 'red';
        icon = (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={iconClass}>
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>)
    } else {
        themeColor = 'yellow';
        icon = (<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={iconClass}>
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>)
    }
    const className = `flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-md text-${themeColor}-700 bg-${themeColor}-100 border border-${themeColor}-300`;
    
    if (!isOpen) {
        // exit
        return <></>;
    }
    
    return (
        <div className="p-2">
            <div>
                <div className={className}>
                    <div slot="avatar">
                        {icon}
                    </div>
                    <div className="text-base font-normal  max-w-full flex-initial">
                        {text}
                    </div>
                    <div className="flex flex-auto flex-row-reverse">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-x cursor-pointer hover:text-red-400 rounded-full w-5 h-5 ml-2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}