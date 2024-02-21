import { Link } from "@remix-run/react";

export function PlansPage() {
  return (
    <div className="w-full py-12 lg:py-24 xl:py-32">
      <div className="container grid gap-8 px-4 md:px-6">
        <div className="space-y-2 text-center">
          <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">
            Pricing
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter sm:text-5xl">
            Simple, transparent pricing.
          </h1>
          <p className="max-w-[600px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Get started with our free plan. Upgrade to unlock advanced features.
          </p>
        </div>
        <div className="grid max-w-sm gap-6 mx-auto lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-12">
          <div className="border rounded-lg divide-y">
            <div className="grid items-center justify-between p-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                  Free
                </h3>
                <p className="text-gray-500">
                  All the basics for starting a new business
                </p>
              </div>
              <div className="text-4xl font-semibold">$0</div>
            </div>
            <div className="grid items-center p-6">
              <div className="space-y-2">
                <h4 className="font-bold">Features</h4>
                <p className="text-gray-500 text-sm">
                  10 projects, basic kanban boards, 2 team members
                </p>
              </div>
            </div>
            <div className="p-6">
              <Link
                to="/"
                className="w-full inline-flex items-center justify-center rounded-b-md border-t border-gray-200 bg-gray-50 h-11 font-medium transition-colors hover:bg-gray-50/90 hover:text-gray-900"
              >
                Start with Free
              </Link>
            </div>
          </div>
          <div className="border rounded-lg divide-y">
            <div className="grid items-center justify-between p-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                  Pro
                </h3>
                <p className="text-gray-500">
                  For teams that want to track progress and automate workflows
                </p>
              </div>
              <div className="text-4xl font-semibold">$12</div>
            </div>
            <div className="grid items-center p-6">
              <div className="space-y-2">
                <h4 className="font-bold">Features</h4>
                <p className="text-gray-500 text-sm">
                  Unlimited projects, advanced reporting, 10 team members
                </p>
              </div>
            </div>
            <div className="p-6">
              <Link
                to="/"
                className="w-full inline-flex items-center justify-center rounded-b-md border-t border-gray-200 bg-gray-50 h-11 font-medium transition-colors hover:bg-gray-50/90 hover:text-gray-900"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-3xl grid gap-4 lg:grid-cols-2 lg:gap-8 xl:max-w-5xl">
          <div className="grid gap-1">
            <h3 className="font-bold tracking-tighter">
              Can I cancel my subscription?
            </h3>
            <p className="text-sm text-gray-500">
              Yes, you can cancel your subscription at any time. Your
              subscription will remain active until the end of the current
              billing cycle.
            </p>
          </div>
          <div className="grid gap-1">
            <h3 className="font-bold tracking-tighter">
              Are my projects and data secure?
            </h3>
            <p className="text-sm text-gray-500">
              Yes, we take the security of your data seriously. We use
              state-of-the-art encryption and security protocols to ensure that
              your projects and data are safe and secure.
            </p>
          </div>
          <div className="grid gap-1">
            <h3 className="font-bold tracking-tighter">
              Can I change my plan at any time?
            </h3>
            <p className="text-sm text-gray-500">
              Yes, you can upgrade or downgrade your plan at any time. Simply go
              to the billing section of your account to make changes to your
              subscription.
            </p>
          </div>
          <div className="grid gap-1">
            <h3 className="font-bold tracking-tighter">
              Do you offer discounts for non-profit organizations?
            </h3>
            <p className="text-sm text-gray-500">
              Yes, we offer special pricing for non-profit organizations. Please
              contact our sales team for more information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
