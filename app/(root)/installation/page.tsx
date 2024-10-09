import { Card } from '@/components/ui/card';

const InstallationPage = () => {
  return (
    <Card className="w-full p-2 overflow-y-scroll">
      <div className="container mx-auto py-4 lg:px-4 lg:py-2">
        <h1 className="text-2xl font-semibold mb-2">Why Install SilentChat?</h1>
        <div className="pl-4">
          <ul className="list-disc list-inside mb-6">
            <li>
              <strong>Quick Access</strong>: Launch SilentChat directly from
              your home screen or desktop without opening a browser.
            </li>
            <li>
              <strong>Full-Screen Experience</strong>: When installed,
              SilentChat runs in full-screen mode without the browser’s address
              bar, giving you an immersive chat experience.
            </li>
          </ul>
        </div>

        <h1 className="text-2xl font-bold mb-2">
          How to Install SilentChat on Your Device
        </h1>
        <div className="pl-4">
          <p className="mb-4">
            SilentChat is a Progressive Web Application (PWA), which means you
            can install it on your desktop or mobile device for an app-like
            experience. Below are step-by-step instructions for installing
            SilentChat on various platforms and web browsers.
          </p>

          <h2 className="text-xl font-semibold mb-3">
            Installing SilentChat on Desktop (Windows/Mac/Linux)
          </h2>

          <h3 className="text-lg font-medium mb-2">
            For <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>:
          </h3>
          <ul className="list-disc list-inside mb-4">
            <li>
              <strong>Look for the install icon</strong> in the address bar (a
              small "+" or computer icon). If you don’t see it, open the browser
              menu (three dots in the top-right corner).
            </li>
            <li>
              <strong>Click</strong> on "Install SilentChat" from the menu.
            </li>
            <li>
              <strong>Confirm</strong> the installation. SilentChat will be
              added to your desktop as an app.
            </li>
            <li>
              <strong>Launch</strong> it from your desktop, taskbar, or Start
              menu (Windows) / Applications folder (Mac).
            </li>
          </ul>

          <h3 className="text-lg font-medium mb-2">For <strong>Mozilla Firefox</strong>:</h3>
          <p className="mb-4">
            Firefox does not currently support automatic PWA installation
            prompts like Chrome or Edge, but you can still install SilentChat as
            a shortcut:
          </p>
          <ul className="list-disc list-inside mb-3">
            <li>
              <strong>Open</strong> SilentChat in Firefox and resize the window
              if necessary to make it a standalone experience.
            </li>
            <li>
              <strong>Bookmark</strong> the page by clicking the star icon or
              using the shortcut <code>Ctrl+D</code> (Windows) or{' '}
              <code>Cmd+D</code> (Mac).
            </li>
            <li>
              Create a <strong>desktop shortcut</strong> manually:
              <ul className="list-disc list-inside ml-5">
                <li>
                  On Windows: Right-click on the desktop, choose "New &gt;
                  Shortcut," and paste the URL of SilentChat.
                </li>
                <li>
                  On Mac: Add the URL as a shortcut via the dock or manually in
                  your bookmarks for quicker access.
                </li>
              </ul>
            </li>
          </ul>

          <h3 className="text-lg font-medium mb-2">For <strong>Safari</strong> on <strong>macOS</strong>:</h3>
          <ul className="list-disc list-inside mb-3">
            <li>
              <strong>Open</strong> SilentChat in Safari.
            </li>
            <li>
              <strong>Go to the top menu bar</strong> and select "File &gt; Add
              to Dock."
            </li>
            <li>
              SilentChat will now appear in your dock as a shortcut, giving you
              quick access without the need to open Safari each time.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mb-3">
            Installing SilentChat on Mobile Devices (Android and iOS)
          </h2>

          <h3 className="text-lg font-medium mb-2">
            For <strong>Android</strong> Devices (<strong>Google Chrome</strong>):
          </h3>
          <ul className="list-disc list-inside mb-3">
            <li>
              <strong>Tap the three dots</strong> in the top-right corner of the
              browser.
            </li>
            <li>
              Select <strong>"Install app"</strong> or{' '}
              <strong>"Add to Home Screen"</strong> from the menu.
            </li>
            <li>
              <strong>Confirm</strong> the installation when prompted.
            </li>
            <li>
              SilentChat will now appear on your home screen like a regular app.
            </li>
          </ul>

          <h3 className="text-lg font-medium mb-2">
            For <strong>Android</strong> Devices (<strong>Mozilla Firefox</strong>):
          </h3>
          <ul className="list-disc list-inside mb-3">
            <li>
              <strong>Tap the three dots</strong> in the top-right corner of the
              browser.
            </li>
            <li>
              Select <strong>"Install"</strong> or{' '}
              <strong>"Add to Home Screen"</strong>.
            </li>
            <li>
              <strong>Confirm</strong> the installation, and SilentChat will
              appear on your home screen.
            </li>
          </ul>

          <h3 className="text-lg font-medium mb-2">
            For <strong>iOS</strong> Devices (<strong>Safari</strong> on iPhone/iPad):
          </h3>
          <ul className="list-disc list-inside mb-3">
            <li>
              <strong>Tap the Share button</strong> (the square with an upward
              arrow) located at the bottom of the screen.
            </li>
            <li>
              Scroll down and tap <strong>"Add to Home Screen"</strong>.
            </li>
            <li>
              <strong>Confirm</strong> by tapping "Add" in the top-right corner.
            </li>
            <li>
              SilentChat will be added to your home screen and can be launched
              like any other app.
            </li>
          </ul>

          <h3 className="text-lg font-medium mb-2">
            For <strong>iOS</strong> Devices (<strong>Chrome</strong> on iPhone/iPad):
          </h3>
          <p className="mb-2">
            Chrome on iOS does not support direct PWA installation. Please use
            Safari to install SilentChat on your iOS device.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default InstallationPage;
