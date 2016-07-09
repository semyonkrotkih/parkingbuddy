using Coded.DataAccess.Entity;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Coded.DataAccess.Provider
{
    public class AccountProvider: BaseProveider
    {
        public bool ValidateCredentials(string login, string password)
        {
            MySqlCommand command = null;
            bool result = false;
            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                connection.Open();

                command = connection.CreateCommand();
                command.Parameters.AddWithValue("login", login);
                command.Parameters.AddWithValue("password", password);
                command.CommandText = "select COUNT(*) from membership where userName = @login and password = @password;";
                var userExists = (int)command.ExecuteScalar();
                if (userExists > 1)
                {
                    throw new Exception("Duplicate user data");
                }
                result = userExists == 1;
            }
            return result;
        }

        public Account GetUserByCredentials(string login, string password)
        {
            MySqlCommand command = null;
            Account result = null;
            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                connection.Open();

                command = connection.CreateCommand();
                command.Parameters.AddWithValue("login", login);
                command.Parameters.AddWithValue("password", password);
                command.CommandText = "select UserName, Password, FirstName, LastName, Email from membership where UserName = @login and Password = @password;";
                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        result = new Account();
                        result.Login = Convert.ToString(reader["UserName"]);
                        result.Password = Convert.ToString(reader["Password"]);
                        result.FirstName = Convert.ToString(reader["FirstName"]);
                        result.LastName = Convert.ToString(reader["LastName"]);
                        result.Email = Convert.ToString(reader["Email"]);
                    }
                }
            }
            return result;
        }

        public bool CreateUser(string login, string password, string firstName, string lastName, string email)
        {
            MySqlCommand command = null;
            bool result = false;
            using (MySqlConnection connection = new MySqlConnection(ConnectionString))
            {
                connection.Open();

                command = connection.CreateCommand();
                command.Parameters.AddWithValue("login", login);
                command.CommandText = "select COUNT(*) from membership where userName = @login";
                var userExists = Convert.ToInt32(command.ExecuteScalar());
                if (userExists > 0)
                {
                    throw new Exception("Login is in use");
                }
                command = connection.CreateCommand();
                command.Parameters.AddWithValue("email", email);
                command.CommandText = "select COUNT(*) from membership where email = @email";
                userExists = Convert.ToInt32(command.ExecuteScalar());
                if (userExists > 0)
                {
                    throw new Exception("E-mail is in use");
                }

                command = connection.CreateCommand();
                command.Parameters.AddWithValue("login", login);
                command.Parameters.AddWithValue("password", password);
                command.Parameters.AddWithValue("firstName", firstName);
                command.Parameters.AddWithValue("lastName", lastName);
                command.Parameters.AddWithValue("email", email);
                command.CommandText = "insert into membership (UserName, Password, FirstName, LastName, Email) values (@login, @password, @firstname, @lastname, @email)";
                command.ExecuteNonQuery();
            }
            return result;
        }
    }
}
