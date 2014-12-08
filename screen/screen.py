from pylcdsysinfo import *
import sys

d = LCDSysInfo()

lines = (sys.argv[1:] + ([""] * 6))[:6]

d.clear_lines(TextLines.ALL, BackgroundColours.BLACK)

for line, text in enumerate(lines):
	d.display_text_on_line(line + 1, text, False, TextAlignment.CENTRE, TextColours.WHITE)