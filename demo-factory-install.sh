#!/usr/bin/env bash

# Exit when any command fails
set -e

# Parameters from Demo Factory
STACK_PREFIX=${STACK_PREFIX:-"deep-learning"}
ADMIN_EMAIL=${ADMIN_EMAIL:-"chadvit@amazon.nl"}
HEADER_TITLE=${HEADER_TITLE:-"Customer Name"}
HEADER_LOGO=${HEADER_LOGO:-"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAf0AAABWCAYAAADFYE8RAAAAAXNSR0IArs4c6QAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAJZJJREFUeAHtnQmcFNWdx/+v+uCaQRAVBfEG7xkGRIMaxY0xohslbMQrUbxiPKJBjcSZIduRGdS4aqI5vOOVZFc0aNSNa4wfk0gMGmBmNBpRDKtRI0FRZrimu+vt71893V2vurq7uqcHiv383+dTM/XOeu/br+pd//d/RGKEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJgwAmoAX+CPKA8gUNa96UUHUta70aaRpOiHYh0Nyn1dyJcit4jir5GyxOv+SaWSFj0lwPK/5YLZ6UL4mutaNZCq8Dd6/DwKTbyo73OOfvkxA6UTB2CvI4nsnGpPVGWNOzrUJbVmbLQ34hindSRWJWLxzenPBwx7LWw+JW1WLpTWsZRkqYjz3vgN9gF+d4JQT9F3j+A2/tk6d/RsralJctfLO1yfMtxLZZu1r0cuyyHcvnIplfufzY9DldJmu545Z5RjX/QvBz4mqZEwq7mEUXjDGT9KfpQlwfXgbc6jyBbT0V9HQOfXXANJqX/Tja9SyryLlm0kk6OLKl52bPZ2NoMsvmQ/2UJlG8oyiYhAaoi0JQYQ3bvVXhJZ+LjuXugNBStIGU9ikb1YepY0JGL09ByC77A38zZi93sGx9ECxO9hndT60mUth833Hwt6svU1Y5ne8yhC0bR5vVXw/VSlGOox9fHqn6BdM4wPBqai3cmjICBLZupa8HgkqEnJ4ZSMnkxwpwGdpNLhs14ovOlHiMVu6mg01IqcmMLc7mtRJAu2jc+peB3KREh59XUchSl9fOwF3+Px+48mH592WYqn49csqVvrM9RV9tzTpjK0lwLfm+CxVtkWW+COa7Y4opYlspY8Lz8AHWj/LtS6lnst6XqT6l88GChV1+Fxv1kdFR3LBXU8VMKgwf6GZH1AHXO/0vZ8OUChIFBuTyKfwGB8iO8giji0C8C3Eg2ttxG6d638aLOCdzg80M1TSDbvga99+VI40lqnHdgv/LS38gTWy9Ag49y6KtxBWjw+/vAGsTnURHnO9XLDc+NARt8fvCuKOOlZCffoMbmm4l/x9qYBnozlag4qYYbh6HB/yniFW/wK050QCOMBL9D8YQzUIf/HaPSh0j3rkA9/glNbuaR6bZhwlB/eFaNvyFJ/Srq7/mBGnymq/VYXHhX06/QxOYf02GJ4VVBDwODqjIukZiANPpbsh5MnDeFNvUscxoPokH9erTWJxKlO/Hyf7Vf6VQbuek7nyNt/wRlqe7DUe1z+xNvamJ7WtH5DBqdO/Gh5GnQKoyOO521zetfAXtuxPpvtH01Ncw7rKKErLXosNBeFcUJW2BNMdSfr2NpayU1tl5PR143MmxZNPIThvozad5kSiW7nG+I1lEjf8EtCgOHi2hT8s80+Y5Y8GgIGQYGFWVYAnsJVFtpvOmIvRyBifMwwknfi2D+jb3C+rdWL5OlVuCF/BDjN6w7al7b3w2DucN8G1dNG2jI0Gdo44ZJ5uMVT+HfjWm/s9FADTP9ytnU63g2f1ROLRqS1+960/+JtH3W4tUriPcqpnLfyZSBxqKRPatoWgUe6k9wWlbgXM5B6SnIz5SiwSa17k/rk0+A597+YVQP8vsC0oAcBUEGgbgzw+v7aNj1uII4vPZP6nc0seV86mjHlGkFRql7ke5UpLu/E8vhaN9PU29uohev2Fg2pabWY7Ekc5ERTqlHkeZYpPkZw72UJZOPTaWCOH5Kz0DawTpJfmkqwqyI3gtpcCelcIZE0xAsWc2ldd0n07TEFHo+0VM2T0ECcF5IHx8476XSDEP9mdhyMn73n+Pd9J9VUwoyKPQnlPcD1N+PcT8cYcfg/hC47VFQPK1uoaUXJgvcizmEgUGxvIl7YAIy0g+Mqh8BG79zDKbU7kMKPg2++hgN5EVUX78jDa87AY3+rZh/eR5hX8Da5z1k1Z1JX4qNpEhkGl7exXDPG6UW0JKWD/MOfXdKb8S6+SV40dcW+JVzUPRH0rG2ksF66bv4mKBDYpgu5PcY2j52OEWtm1CGP2IK90VH/sAIVsaiMOrj8nsvoqedMln0TIGfw0utKpoyy0+k7WfRAPg0+OikKOuLNHb0DhSPnUMR616KqCX4TR7FdQ11tu1O0cghaOB/UZi+HowyPkgsF1GJGTTsaoqqf0OargZX70vr11xXNhmekk1rNGZuo56ljrZTUD8CyGa44nE+LLXQl6ebv1afumKVvvVNM3IXReJnQHZhDMWGj0A9uRRlf9cnof1obfJuH/fqnDgvWr1VXWRXrDDUn6Z5U/HOLfRv8NXjqLNTUAfG4lvxZYrjG6LpJfyuj9KQYZdS54I98f04HPUj38Ar9RRkM37iKmXp2zAwKJ1D8Q1IQEb6AUFVHWxi63iyUywAVziNpgjrmrEriVInUnfPr9Ao4cV2jZ4dWXsMen7JDRPdB7/82qeiVTQy9v2q89WviNqcimYBISs2ndLJM2ht72PI53a55O3cXbAbrc9E/DMLAmdGMU+gkeV17ODTwNMSg/vyZI5UeWZFWd+jEdFr6ZPkufTeh+hQ+Qj0NbZg5K8eQYfsEupe/wjC8JLGTq78ISX9M2pITKWuxKsu99K3atxbaPdakdZ/uAJeBnmDx/Dxft7lZt5uSrLQZn7mQal1FI2dR4fcWd27bOvvIr2jzIf001aQZiqT4Bv4Zan3b+ho3Ib60kCUnIX5rJvw/LrcE3mGqbF1MTpbt+XctuZNGOrPYe2jaRPqHi+HuI1Sa0hb3yAr8jSEglsx6/RD1NWDcx0D/n5sXE9YhnoTnd6PYMvEV/RPGjz0PHdSJe/DwKBkBsWzEgIy0q+EVjVhbf1jRPM2Uh9hRPl59MibSSUfxNo4pnv1kXipI/6P0Pwi4+PoXsONzMU0qGuk6B+z5q7TEnUYPe1npKv1j/DRORgf7xtRhnyDbwTaSpa1vQuQJ8+0v3oDH8fDKRa9mz5O/g86Ej9C3icXyeGu8PsmdXdjyYI2kTXsIPz/pRmWG63ehZiaDt7wpt6dRyOjP0A6f3ClpfA734t08o2gyxPCVyfC/1y3E/IGYVAaQel3ZpjuobSx0OFe4H0LaQhEKsxysWAfKbNryB2hxnlNoShBGOrPxg134Dc2O61Ev0JdPAAzaeshEPkX+F+Ji5cBC6f+tR6PevKZHE/LOt93hjAXwHMTBgaeLIm1egLS6FfPrnzMhtbj8bIdWxCQXzpbj6JerH1rfVyBfzkHnubvnP9wuWAD4r8ujY+xNuuNctbgv1D989RKfPg9F/HIpLzh0Y43Li8RsGloha4AdYmZCNbuSU2HvMMBtDnZibIEG+XyR9e2n8I39joas/MZaLD+aKZLmJpOBR89aX00wl9Og+Kz0YnAcKzPaL0nOiI3Z625/yzkptVdOTvf8BTthPhD2ImAjqM1yPCr3vJOAU8334gqL3MQ5Nk8W5LG0kgE68+W/rYZBcKSZH/NdNsKtjDUH0dYFFvy3Ia3Psbip6MuXo/6+yufDoE7tHmv1J20vA2zigFNGBgEzKoEC0Yg+MgkWHoSyiCg2w0rW5S6hzQU7WinwRlc6I9pZ1J/hfunuPZBp8A9lczBNZRtzOGbrWLS9uaC52oVR7nQmJoDNpSjB1OPM6luyJ9pI4/menagVLRwNqOrfZ+CNBub56Kk+KiVMUq1YSr4B/6h7Da4owFxGaWuQuO5E9LG2rEuzIti7opHTuPgj8tjtD6PPljNe/Znw6fDGFlpnaCGGx+irm/lG3FPdMOq7XYIRD6N512FZ7nWV/UF6LD8Emuu8Osz3T234Vn55R3CKDmKcJntfpgqr5GJxb9ASxNc/2pnWB6F9HboNB0Lrth1kp2xgkxEWv2Sto8fgLX8C1A+jEj7jKYZUCRzyYApk8k+p+T/UNSf+WYWnVmRcymdwjKYd9anLyQv/bFSrwzP0bn4jp6EEVfk7IFuQsEgUE4lUDAC5ogtWBwJFYTApAQaMu2Vql9JdcMxHdt7J/zMBp9fSLKm09Ad6qmz/SBcR+AajR79jniBL8docIXzWKUeoo75LwfJwoCEGTqK5QvQMXEZRcdBkOhxl0vfrd5ManAHvXDNWlr67U9padtK6kxkylEYuLYuPDJWapaRqKLfUDT6IDon96PxMRt8pRaB9f6QxB/psO9q3w39hdFYf24B/14jHa1b4A7JaLrGcCe9M1nrzFGZGcBrG4SlnQdoQuxe5PUZw1Ppu3Nb2BpbvoQP+JmGfwTKkOzIHoh/teEeRosV+dAZXXYuuIyGxJtQf17NZxMdq0+gyVFD8NMwYPkY4TfYSiYM9eewBOuGOM5D4FYaHFsF9/8w3DNCes00LD7KEdzrbP8slBDt3FeHERYdcGWdGbhDyomHgYFRSLHUgoA0+rWg6JdGOlX48Y+oK2j9p6ci+NFGFKXuo6GjGp2RnXfL1tLEGkit34op5Qa8tNzr9zQ0RkoDb+H8aWwrdBuNLV2xCDotWGc0zShMQT4DJSBYF9/CprvnX/FhjOaeyh/FuDoPWvgw+wJJ+byBcBmdjYZ+pjPCdasa7kqsRidgAcWsQ/DRfDcXhdNNo+MwbNRdaKxfyrnzjU4X/u5GAK8FHcMVyXn4kJ+HtD7J+bIile7uW6lpATp9dHvOPXPzCAThHsfIubDz4gkYOuuSxDp0bu808qVpMjoCfzLc2GIl0WhtJROG+rMJAr5uw7NQsVgL9tezMOnwnJczOxU5DI38dfRiguUk8iZTh79F9cPHVDxYCAODfEnkrkYEpNGvEcjCZPQJhhtLWe8TfRoN5gWGO2FP/ITYhWX3Z7Mq1c6276Bxes8Tf8tblfI27rvSxt57qH67r5ijOGRN64m0qXcJtK55Zj0GPNvexvd5GlTHe/EvNZ+sWC3rA6abx7Z0/iuYyTgXrtxByBitD6RNH/H+9Z9lnZz/Gjr8T0mYSwpGAD+LvgYf8jHwuczw1fQVsnueA8P8Eo9SqylSdzEUtNwA9/FG+FpYkr2LIO3NGh/9r9poz/ubmVXIV2hruekGWyqAatmCSDVzCEH9YQVchvkfqsdGPEcxl8tdQSC4c34hP1cQWjy3220NeB8CBgFzKsECE8iPhAJHkYABCezpCfcbOhCfsRV0kOEewejTqw/fCBBCy8hoG9Zgv4KPz1hX7r5MPeuWYjR9AvSBP4vGcELOj4XgUvR7bMU6DR2XJ3PuA3vjWee2nqDuDSz9nq/zit7HDEtzoGwsb3sW2+keNBQN2ZjhsOJzsXPBLVNQT39L8W//RqB0OVBmqeEBzBw00YY1M2HPS+JrT30h+jrRhkaU45LA6VcWcD+kXTyGDfmN/hpl748yug228UGw1SsSErXedwfawvdbv/5wx9JttPUMtpdyvngXRNb8lWbEbod0ib9h/fjp5Gx/Tx9Xbb3o6kBsfQY+WRSn/hGQkX7/+JWKnReg4VAKJ8wtcgTz3FtqPqLl7X8ulUgo/VhjmqW+WZA3ra+DPvCzoFDoSBR4meHvaAbUi6ipebrhPlAWt06DzDPQCNtNnsf9vuwMixFBP2NYSTWRc2KgZ80/5dKnYEYoYcOSw4Y1GL3HL0Rd+advQNbrEK1/rk85j/vD7xs8lI5NLbtjtmuOkTeFumLrfQw37gqpyOsety1nDUP9Ucpc3ohYqwBgogFBqRdLCzv2QoCSt9QGvCh9XC79MDDIZUZuakVAGv1akXSnc8QN9RgtuRt3fMLUP7Anv9EdDGu4Sw37tmRZ3vYI8j+vIMs2tWEd/yqK1f8LGq/Fhj+Psm1aSHwGwUAaZ5+7S+ELPysS/QeakV2Mx+oK+UeV2UHLpaf/YaSr3FL2hk9pi8bSQ8SGTgZoaPQanpWor7+Mkt2YVfDZVeANH9RuqRvwO0GeoNjlyJEETc0/XDJ1BBTHNGPJ4LfosEBFj8GnG78Ny0WYWz4V/S9kLDb4JzjArmGoP37fEAtHVNueRp8ctde1BxIGBrUvlaQIAtLoD0Q1SG30G4XZaHS8vM1JzoHIy0Cm2dne5tvw80leye4bqW47HtX/1sgCj/ht+1EooDF3LxiB+mlJDinkr9IYOWrT3TnfoIJnpQomoDOR3cJ/7KIt8znBH4F9EemfosP0LLiasgIWnU89649G4mcHTy5ASGdrooWlmCKXot0DpFImiH03RprtaOz/BQHd+gTwm6izUWYIVnpkYAhqZLeWCWv9SUa4DtdXj0X9Gr8z3kn35Xk/s4mHlUE2f/K/agLeRqjqhCSii4AjoezWq85+2IIUjXW6QsHJqynO8N02LNzwW3QOpvM3mRnGHvKeT+/GNriT4GeOkHmk+knyMjN8DW0stORWeMNJp5zR5QfGUzQOIqnEKG2GV30jfI3f1m20c/CJ26WCe7BJdd9G9XXfQBn61rQVdArU/RmN5h0VJBQsqNZnYNsfdCIUuSo6LCnYI51QSqXQ4DdD1wAOiEmb0vysoS8Sb68gtdoGDUP9cfKgzJmOSGpnfDM+NAtbVJOkGYxtCsuLCr939rKif8U5CO8VBoRLGBj4Zkwc+0tAGv3+EiwWX3leTh5R7XXAm3jxNuaj6O0x5Xlo3r6N3nUsuA+73j+L3P/dKIGmWZRMNdOg2Kn4wGOrlsvwHveJiREul1rfmg28ovHIg9npIv1Zmn6re+RZOg82fd4IoCE+NTnBe8nNNGJ2/wTQtP4q9Pwfg87U+agvq7Dd6gpI8d+ORj8vxW9kZJuyQHcD3UEqNh4jzicopRajITvAKIGiX9CyRJfhtuUtW7/+8Gl5bpPGrIuyvHIOhwdW/8y7PbhuZS8rPcqdvM+9+fxt6R3yKYw4ZQhIoz9gNUG/bSStoI73wNd4Ov9Vw51wgEzNp7pV3/Sy4uflzduUl1zPutoeN40p7GjBMkQ2dPH/LJAY42NovaN6u5mSvfvjQ/8tI7LWI0iljjLcamrxrHVq/UWKD3sS+XArFtqV3lvNug/Km6Z5R+NjOdsIqCKPQzPaF003qNTdcadVhltVFvt25HcZdgccgV0RvDVwZlXJVBwJU8BK/VfRi4aZo0+/9JV1l6PUiBUbOcqNrIsxojwRo3dIo48cBbfroJGyjSjdCaZ7Gkko1oYYu8Jw2yqWENQfRWYDr/QXaHD0KQMH81ubLL4DJRlHfWcdE7ic/fxG7DKWEDAok0PxrpyANPqVMwsWQxHWz1xGY8/x40mWar/X5cpT/AdA13rxQ1bcgRtaz8PMwD1uJ+fe8uhDZ8UdfAQrkTl1l075zSqYbpZ6H6cC7lr2GQUB4LB0AZ/jPQOXazYDNltdTHbsMYQwOyG2bvBLpiZu3mNmNR2DzscgpH27mb6+EkxPNd08tsmJ/chO3wdX11o9Du0ZOvJRyCeYmvJIPU2sU6Fio0zlNFxfNq6/E0qE+R291ZMc1nbpZY9bbawxNLid7dhaWeRa3uy/s8D9dOWoaubOQd9l74Q1/RnYOnYjqbWXZoJq3poYcUfDPY5nHnYMTitc7XHf8tYw1B+vPgytj8fW148B41cmEN0Ktc3Hm259NmbJ2iWVc7BRZfUyDAx8CyWO/SEgjX5/6JWKa1mF+9HTdAuNGf1TRPuDGVWfTh/jpKyJrTNo6s1DDL9THo4457Wz5DNBIIr1bfPZ2m6j9Rq31bnfDOEoRawlz23y23GyrlqbU9YEbXta75f1zv3PPoNVc05u3Tvn7r2Z0AgpeT4Ex2WUPoa2p3VoM72zHAe7QtX2tmBUj0Nc0sm7SI+cCy5v5R+Gw4O0/k9qaPk5lhv2yLvjjpcfGluvhBa/5Wig8n7ObIF1Nq3/eDZCmb8FWdy5qdxEaQ4imcsjRCdB6RGmvzErYhgoFCJ6wXAKk8XGLgQ+SS97ESXQ37sA1wmoG9eiA4jOl1pQmGX1JAXpVBRGrL1LGOpPLPoECubuKNfjcKXv4ZCmC8GPG/+McY7ctX+NzuvduNy6M8hZfmpshepvCOx5l4fSRQRTs+mGgUE2L/K/ZgSiNUtJEjIJLGt7HQ3JK3hnXQ0bVK5+sPrfScXP9zlwZzeMGhdhr3Ya8VZA2IYbgN1pRQdOivOco22ncTSpnoop2OwHoXD0pQmNvn7F+GRo+2JsnVqF6VV0OhSUdtgQ4tJNRsatyKuUsqcZbmzRKvOM7p4DEecP+Ljwet9SXNyQ84zCp06ab3RCOrhgS1mcNg/HKHlNNr8IzgYH3wyUean5I2psfhTJz8o/Ao2OWgv5gshsCK79Hvl0dXrR8bJ7T0cclJOnNTV+j17u3CDfHqOs74EBRqP6e4YPa8sbGamu0VexTyiSOge/CesCcD+TZQZcBjMMw6BQaMOadpfjNnTLJ+gloVZ69Mn03oezwTDfgVQ4JnhKy+30cvu7W71AYag/Lyf+gffsv1HXTszx0ARtjCnUMesSLI/8IufON3wYFGHrZUPzh/g28KFR4zG7Nc4Ik7f8nKLD3qbUus/knTx3YWDgyZJY+09AGv3+MyyeQkS1Yl/y40YAW8+laPrXlLLOgZAyzsl26dDmgM6Up2aNZfsb8dwWPje7qfUMOP3McY5gHT3laU81GvS67U7FevDleEam989n3bMEuO0Jm01b0cM4IOd/oU8AeuuzjvjPx9d2zF9FONAuZzJ7rf8Vdr76jDtS1s35/zoNWhfBZC86DIb7Xw1brS2ReAule3FYjbvTpG6hmH0QNPFfBPfv4zJnVnhanZytZf65YQU5I6LXYmbmaQSoMwIpjGJZcVG1hrX+NTb/GHnCB93H8AyDxgwDn3/QWHwZ1ydmcKdU72/R0CSLRlDqPupoSxT19/NQ6r1cHWR/jbXpD1ZPhxa+yzHWfDIXhX+LzXQD7Fy3B8qci/LNKJE4DoVq/5zjH4b6E7WuoaTNHelsBxW1QN9LsbqDKbmOZ3wu9ynLaDAe7eOecVLqOewkugDbah+BwwQjnLLyMwjsEQYGRgbF0l8C2YrU33Qkvh8BPrfaq6CGX95U+iE0+G/jkJUD0aKaa/9+6fi52XRdbimAZxXcB8I44fV06umZjuejAfFojPNLT2GbmRWfg+1i1+ODsYsRRON0uvysguFV1sINlWXNwdnxx6ExixjhlXe63/Dtv2VZAtP46g4jIe5k9bK8hX4JB+lglsOzlm4Edll4FK/UTEdBDstgFB6a9CZFxt3pilHdbTR+NZ7jXZbJpKWhSKdr/pLqEg4Yi1Umaw2teUWvchLfhQ9SNBecbcND27fQkB2eQ1nzjb4TQJ9Gk1qKjz6NRKqysOKsEuWj/PR4GOoPn/ug6AGzpLytc91CNMiYabLQQVErTf8iNt4myUstesRJOLvhR3gH0JlwGf5WjYj+1OVC2EWx7b1DRgHE4iUgjb6XSM3tEahVVVjPNsxuaABfxCErLTS87kxMN38VYV7Ay502QmUt3AgodQ3Opj8z64QXdhymeK/K2RWfD+8x2v4BRay3sT0KSwzqv+FrjrMzwXkL1U3ogOwHJSlH4YOI9ULDIA7vEy9i+PS6ogbqVZV1EtLH9L++xyfYX3zcausUjWENX5mHkbBOc00vQWXwqTR29DT4X4nLPy+Zxv52CJgdhDCbcfLdqyjL6UYmFfZTKz2Lll5YgoURo7iFtdBZGM0X1oUu2jf23eIRQ+wTiS0Fn7uMHLKMxMaPMevlqHPe7PJTEFbj5Sv3EofLewvfhqH+qNgc1IcVRsk1to/ava9BzHNvnLyXOYFT0RLUURae9Bis/yt1K05mbETd+jmpT14A39lmIISJq9MxU5Uy3WELA4OCTIlDtQSk0a+WXNB4nfOxtqawjuxt0B0Bsq9Tdw+muNNxNLonYq1/B8ynYZSjTsK6+yyKRKZh9L0nplP3xcv9LNb8XVPpTgbmUlNijHM3MgbBKK9aWSiNSdnLiHq/jr3ep0FRDqaj4wcjbUjYW1+AQNDetO/EYbi/Ax2Q/+pbIzQ/tkr9CEf+Ple0uApCZbH4jui4TCIrehw+Lqc5ow9Oe/vYEYg3FtORv8FHxhRG4z3zkXGLi6ZbKw9uROPEp4V9aCTJU/5afxfryovBo4tGxibiJL098FE8BmU5FWWYjuOCG+hLMcx6WD+EauEbwP8pdBYyvPOJQc8itMp1LOjIO/Xzbvn8F/GbuOQFMFMTiZw1IAczRa1W/GYzS1/0Wj9LBE0GdS2on+bUMS91JTHBb5SVn6Q/Q03fMTtW1WYgUPlQ/mIzPmGoPx2JT/DefhG/Ef67DC/X2fadGLU/hU7V0/Sl+OGor/UUt/Zzfs9I9FjU5wkU2w2KwfT9EGSFQJ/uwDXRlQrfsq7Qc4vKUoSBgSfDYq2eQLT6qBIzMIGutqchQHceXi1M/7Igk8tkJGrvQaN7B1xfQucAnQBajbA4tz59NBrisViDnAq30a5YmVtWaZtOorGn2U4PvSlxFuwQrtN5FbeZU+XmYG2fR/CsHGgFPrNvIsxQ2pycQCs6x+N+LzzPnHp3nsDb0kZdnXlYkb+avgbp9kOR7kqkiyUCzSONw6m3dzfqVYfjA7NTQUzuAEWs8yocGW8HDiwDMbQgvXIOLBg2KXEcJJ9ZGtojGAeNZtwp+bh3LcrwO/j/HbskMJWPD2oSuvoXpQ8Fm338H4HGWOmLiM8hqMT0brgZ6UNRSolI46MJWpGEtLvG6ExfS8vnd5YIDa/0uWi4hpUO4/HlfGi9yePqY1UjUUd83H2cipWNhcIaWluRzo/zsZx6Cnb6tbxb351tX4/lq0WVHYjkSSVw+RBP4f0qVsQw1J/OxArs2jkBs3GLkFvzW6D1NOR9MS3q/ScK8nvwfB//12Cb6Sj8vnuQ/Q7ecZYRQgELyqh64DebOtofx//iJgwMiudOfCogII1+BbD6FbSj/X40Wq9j1M8fuXEFaWUa58PhzlcFRsdwypblnLS1PPEatpg140W/uSCBTGPZCHe+8qbgI5D1QoNmWV8t+9HNCCJiWYCOcmLa/DebaPZ/Ns3sf3UTLZvPkv/BTSb/XwsewROSNbw1JKZASPFR8DnS48vWkcj2jHze+0IULYJzEt5M6lzwgk9apZ2CqLbl45YnoROX6v0hjZ94fdGjU7NPYj0EOe5ZxzL/g+SjTBIF3qXSnBm9gxYlvwb+rpEmdrRomlSQTn75an6hX0CXUnkJmEQuWBjqD88ATWmZAmFHNPw+6nczQqj/lsmzu+K673Mlwg3LAsRmUFcCS1YBTBgYBMimBClNQKb3S/OprW9n+0s0eBgLj30fI4uN/Usco3CevutacKZxtGZn2y2Ou3cdu5KHKbUQ63gHQmL/5UqilQ3L05NKfYMmDJToeZkcsKKS6G44/Q95KHZ8bZkkEDeFqdCf4Hc8GFLelTf45dJ3+/NHduzOn6eFs9Ju5232PpHgqfxLK8h/fvmqgkgDFjQM9YdH3NvHjkT9/TbKuba6svIMlboP8kRTAjf42QeFgUE2L/K/KgLS6FeFrR+ReJqzq30OxeN7Ya34xkxvO2B6jhpNdT9G4Cdine5gWn7tb31jsntH22S82Gch/Xd9w/g5sjBhVE1FYzYrI7XrE8iKQSiIVvj4lHKCBjloIrSGTUDaP9yqjRgL23Ee6rbbG3mah8tfgM9bGhbocwQauTO04GJa0mLKCHjD18pelXa/Wj18ANLpmL8YzB8MlHJ++SpQ8C0SKAz15/nEJsww3UDD61GHrfnB30cc783S+0OG7oZ34Bx64ZrqOg1hYLBFfuz/nw8xhbb+f5Yx/KViDXcpaMZTkMS1eZ847YR7/m3ewfUupkPfgZDZKtp59JKKVbxOS0SpJ4X0OW3Np2ztgyUGfCx4pkG9hf8rsYvwLYqn3yoqyONHcHJiBygJwbSsngBvrE9rCCFi37qieqTL0sLoGODsdIsgF1D3RtUfGL9n19ptUmIf6NCfjvzugalmCO5BDoF3XPCBJxbWR7X6HQSk/mjMqNQ6D5LetksgDPXnkNZ98Y4fD6VTuwPkLqi7/B2Bkh5rJd55vON4zyfEXhoQYVD+5cLAgPMhRggIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJCQAgIASEgBISAEBACQkAICAEhIASEQDEC/wcfBtcNQslheQAAAABJRU5ErkJggg=="}
ADMIN_EMAIL=${ADMIN_EMAIL:-"chadvit@amazon.com"}


REGION="us-east-1"
INFRA_STACK_NAME="$STACK_PREFIX-infra"
ML_STACK_NAME="$STACK_PREFIX-ml"
BACKEND_STACK_NAME="$STACK_PREFIX-backend"
FRONTEND_STACK_NAME="$STACK_PREFIX-frontend"

# Infra
echo "##########################################"
echo "##### Deploying infra stack: ${INFRA_STACK_NAME}"...
echo "##########################################"
cd shared-infra
./deploy-infra.sh "${INFRA_STACK_NAME}"

deployment_bucket=$(aws cloudformation describe-stacks --stack-name "${INFRA_STACK_NAME}" --query 'Stacks[0].Outputs[?OutputKey==`DeploymentBucketName`].OutputValue' --output text)
training_bucket=$(aws cloudformation describe-stacks --stack-name "${INFRA_STACK_NAME}" --query 'Stacks[0].Outputs[?OutputKey==`TrainingBucketName`].OutputValue' --output text)

cd ..

# ML part
echo "##########################################"
echo "##### Deploying ML stack: ${ML_STACK_NAME}"...
echo "##########################################"
cd machine-learning
./deploy_ml_container.sh "${ML_STACK_NAME}" "${deployment_bucket}"
./build-container.sh

cd ..

# Backend
echo "##########################################"
echo "##### Deploying backend stack: ${BACKEND_STACK_NAME}"...
echo "##########################################"
cd backend/training-pipeline
./deploy-training-pipeline.sh "${BACKEND_STACK_NAME}" "${training_bucket}" "${deployment_bucket}" "${ADMIN_EMAIL}"

cd ../..

# Frontend
echo "##########################################"
echo "##### Deploying frontend stack: ${FRONTEND_STACK_NAME}"...
echo "##########################################"
cd frontend/webapp
./deploy-webapp.sh "${FRONTEND_STACK_NAME}" "${BACKEND_STACK_NAME}" "${deployment_bucket}" "${REGION}" "${HEADER_TITLE}" "${HEADER_LOGO}"
