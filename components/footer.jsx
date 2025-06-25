import { Divider } from "@heroui/react";
import { HeartFilledIcon } from "@/components/icons";

export function Footer() {
    return (
        <>
            <div className="bg-slate-900 h-32">
                <div className="mt-16">
                    <div className="p-8">
                        <p className="flex">
                            Made with <HeartFilledIcon className="p-1" /> by ari. Social links in navbar.
                            Copyright &copy; ari {new Date().getFullYear()}. All rights reserved. Some rights reversed.
                        </p>
                        <p>I hope you vote for my project!</p>
                    </div>
                </div>
            </div>
        </>
    );
}