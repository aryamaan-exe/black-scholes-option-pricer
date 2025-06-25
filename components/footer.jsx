import { Divider } from "@heroui/react";
import { HeartFilledIcon } from "@/components/icons";

export function Footer() {
    return (
        <>
            <Divider className="mt-16" />
            <div className="lg:h-32 sm:h-96 w-full">
                <div className="">
                    <div className="p-8">
                        <p className="lg:flex">
                            Made with <HeartFilledIcon className="text-danger p-1" /> by ari. Social links in navbar.
                            Copyright &copy; ari {new Date().getFullYear()}. All rights reserved. Some rights reversed.
                        </p>
                        <p>I hope you vote for my project!</p>
                    </div>
                </div>
            </div>
        </>
    );
}