import {Link} from "react-router-dom";
import {NavbarLinkProps, NavigationType} from "../Types/NavigationType";
import {userIs} from "../Helpers/User";
import {ChevronDownIcon} from "@heroicons/react/20/solid";

// @ts-ignore
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export const NavbarLink = ({navigation}: NavbarLinkProps) => {
    return (
        <>
            {navigation.map((item, index) => (
                <>
                    {userIs(item.roles) && (
                        <li key={item.title}>
                            <Link
                                key={index}
                                to={item.href}
                                className={classNames(
                                    item.current
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                )}
                            >
                                {item.icon && <item.icon className="h-6 w-6 shrink-0" aria-hidden="true"/>}
                                {item.title}
                                {/*{item.children && (*/}
                                {/*    <>*/}
                                {/*        <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />*/}
                                {/*        <ul role="list" className="hidden py-2 space-y-2">*/}
                                {/*            <NavbarLink navigation={item.children}/>*/}
                                {/*        </ul>*/}
                                {/*    </>*/}
                                {/*)}*/}
                            </Link>
                        </li>
                    )}
                </>
            ))}
        </>
    )
}