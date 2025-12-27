import { GitBranch } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const Logo = ({ className, inApp = false, hideText = false }: { className?: string; inApp?: boolean, hideText?: boolean }) => {
  const Comp = inApp ? 'div' : Link;
  const props = inApp ? {} : { href: '/' };

  return (
    <Comp {...props} className={cn('flex items-center gap-2 text-lg font-bold tracking-tight', className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <GitBranch className="h-5 w-5" />
      </div>
      {!hideText && <span>Pipeline v1.0</span>}
    </Comp>
  );
};

export default Logo;
