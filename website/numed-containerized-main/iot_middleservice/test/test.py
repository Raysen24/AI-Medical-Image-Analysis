# not finished yet, suddenly feeling lazy
import getopt, sys, requests
 
argumentList = sys.argv[1:]
 
options = "hu:e:p:"
 

long_options = ["help", "url=", "email=", "password="]
 
__usage__ = """Usage: python test.py [options] ...
To emulate a request from the IoT device.
Options:
  -u, --url                     url of the backend
  -e, --email                   email
  -p, --password                password
  -h, --help                    show this help message
"""
 
try:

    arguments, values = getopt.getopt(argumentList, options, long_options)
     

    for currentArgument, currentValue in arguments:
 
        if currentArgument in ("-h", "--help"):
            print (__usage__)
             
        elif currentArgument in ("-u", "--url"):
            print ("url:", currentValue)
            url = currentValue
             
        elif currentArgument in ("-e", "--email"):
            print ("email:", currentValue)
            email = currentValue

        elif currentArgument in ("-p", "--password"):
            print ("password:", currentValue)
            password = currentValue

    # retrieve token
    data = {"password":password, "email":email}
    x = requests.post(url+'/auth-numed/token/login/',data=data)
    token = x.json()['auth_token']
    print('token:')
    print(token)

    # retrieve profile
    headers = {'Authorization': f"Token {token}"}
    x = requests.get(url+'/auth-numed/users/me/',headers=headers)
    print('profile:')
    print(x.json())





             
except getopt.error as err:

    print (str(err))