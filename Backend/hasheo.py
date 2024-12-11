import bcrypt

import bcrypt

# Pedir al usuario que introduzca una contraseña
password = input("Introduce la contraseña a hashear: ")

# Generar una sal para el hash
salt = bcrypt.gensalt()

# Crear el hash de la contraseña
hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

# Mostrar el resultado
print("\nContraseña hasheada:", hashed_password.decode('utf-8'))
