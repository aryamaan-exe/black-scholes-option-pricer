import { Divider } from "@heroui/react";
import { HeartFilledIcon } from "@/components/icons";

export function Footer() {
    return (
        <>
            <Divider className="mt-8" />
            <div className="m-16 flex">
                Made with <HeartFilledIcon className="p-1" /> by ari. Social links in navbar.
                Copyright &copy; ari 2025. All rights reserved. Some rights reversed.
            </div>
        </>
    );
}