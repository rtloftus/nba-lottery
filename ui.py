# ui.py
import sys
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton, QTextEdit
from io import StringIO
import contextlib
import lottery  # your existing file (simulation.py)

class LotteryUI(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("NBA Lottery Simulator")
        self.resize(800, 600)

        self.output = QTextEdit(readOnly=True)
        self.button = QPushButton("Run Simulation")
        self.button.clicked.connect(self.run_simulation)

        layout = QVBoxLayout()
        layout.addWidget(self.output)
        layout.addWidget(self.button)
        self.setLayout(layout)

    def run_simulation(self):
        buffer = StringIO()
        with contextlib.redirect_stdout(buffer):
            lottery.run_simulation(debug_mode=True, view_data=False)
        self.output.setPlainText(buffer.getvalue())

app = QApplication(sys.argv)
window = LotteryUI()
window.show()
sys.exit(app.exec())
