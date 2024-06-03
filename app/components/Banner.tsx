import { XMarkIcon } from "@heroicons/react/20/solid";
import { useLocalStorageState } from "ahooks";

export default function Banner() {
  const [bannerDismissed = false, setBannerDismissed] = useLocalStorageState("banner-dismissed", {
    defaultValue: false,
  });

  if (bannerDismissed) return null;

  return (
    <div className="flex items-center justify-between gap-x-6 bg-sky-700 px-6 py-2.5 sm:pr-3.5 lg:pl-8">
      <p className="text-xs leading-5 text-white lg:text-base lg:leading-7">
        <strong className="font-semibold">Could I have your attention for a moment?</strong>
        <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
          <circle cx={1} cy={1} r={1} />
        </svg>
        Due to increased usage last month, I just paid <strong>$96.77</strong> for a bill from Google for the month of May. While I am trying to keep this
        service running for free, if you use this site a lot, please consider donating to help keep this site running. Donation links can be found at the bottom
        of the page. Thank you! ❤️
      </p>
      <button
        type="button"
        className="-m-3 flex-none p-3 focus-visible:outline-offset-[-4px]"
        onClick={() => {
          setBannerDismissed(true);
        }}
      >
        <span className="sr-only">Dismiss</span>
        <XMarkIcon className="h-5 w-5 text-white" aria-hidden="true" />
      </button>
    </div>
  );
}
