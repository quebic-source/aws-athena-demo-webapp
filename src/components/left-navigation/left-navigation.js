import { useState } from 'react';
import { Link } from 'react-router-dom';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function LeftNavigation({ navigation, bgPrimaryColor='bg-primary-color', bgHoverColor='bg-hover-primary-color' }) {
    const [selectedNav, setSelectedNav] = useState(0);
    
    const onClickNav = navIndex => {
        setSelectedNav(navIndex);
    }
    return (
        <div className="flex flex-col justify-start gap-1 px-2 py-2">

            {navigation.map((nav, navIndex) => {
                return (
                    <Link
                        to={nav.href}
                        key={nav.name}
                        className={classNames(
                            (selectedNav === navIndex)
                                ? `${bgPrimaryColor} hover:${bgHoverColor} text-white`
                                : 'bg-white hover:bg-gray-100 text-gray-900',
                            'justify-start px-2 py-2 sm:rounded  text-1xl text-left font-semibold'
                        )}
                        onClick={() => onClickNav(navIndex)}
                    >
                        {nav.name}
                    </Link>
                )
            })}

        </div>
    )
}