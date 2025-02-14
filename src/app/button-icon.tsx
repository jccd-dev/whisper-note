import { Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ButtonWithIcon() {
    return (
        <Button asChild>
            <Link href="/get-message">
                <Heart className="text-purple-500" /> Message from me 😁
            </Link>
        </Button>
    );
}
