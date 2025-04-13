import unittest
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from analyse import analyse

class AnalyseTest(unittest.TestCase):

    def test_analyse_sucessful(self):
        self.assertNotEqual(analyse('AMZN', '1y', '1mo'), 'ERROR')
    
    def test_analyse_error(self):
        self.assertEqual(analyse('ABC', '1y', '1mo'), 'ERROR')

if __name__ == '__main__':
    unittest.main()