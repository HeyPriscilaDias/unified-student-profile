import * as React from 'react';

interface AlmaIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export const Alma = React.forwardRef<SVGSVGElement, AlmaIconProps>(
  ({ size = 24, color = 'currentColor', style, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      style={{ ...style, color }}
      {...props}
    >
      <path
        stroke="currentColor"
        strokeWidth={2}
        d="m11.085 4.385.361 1.085a11.25 11.25 0 0 0 7.084 7.084h.001l1.34.446-.256.085-1.085.361a11.25 11.25 0 0 0-7.084 7.084v.001L11 21.871l-.085-.256-.361-1.085-.109-.31a11.25 11.25 0 0 0-6.975-6.774h-.001L2.129 13l.256-.085 1.085-.361a11.25 11.25 0 0 0 7.084-7.084v-.001L11 4.129z"
      />
      <path
        fill="currentColor"
        d="m22.775 4.188-.529-.176a3.59 3.59 0 0 1-2.258-2.258l-.176-.53a.329.329 0 0 0-.624 0l-.176.53a3.59 3.59 0 0 1-2.258 2.258l-.53.176a.329.329 0 0 0 0 .624l.53.176a3.59 3.59 0 0 1 2.258 2.258l.176.53a.329.329 0 0 0 .624 0l.176-.53a3.59 3.59 0 0 1 2.258-2.258l.53-.176a.329.329 0 0 0 0-.624"
      />
    </svg>
  )
);

Alma.displayName = 'Alma';

export default Alma;
