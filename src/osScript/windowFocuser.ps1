Add-Type @"
    using System;
    using System.Runtime.InteropServices;
    public class WinAp {
        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        public static extern bool SetForegroundWindow(IntPtr hWnd);
    }
"@

foreach ($i in $input) {
	$s = $i.split(",");
	$windowClass = $s[0];
	$windowRun = $s[1];

    $windowHandle = Get-Process | Where-Object {$_.MainWindowHandle -ne 0 -and $_.Name -eq $windowClass} | Select-Object -first 1 | % MainWindowHandle;
    echo "windowHandle $windowHandle"

    if ($windowHandle -eq $null) {
        start $windowRun
    } else {
        [WinAp]::SetForegroundWindow($windowHandle);
    }
}
