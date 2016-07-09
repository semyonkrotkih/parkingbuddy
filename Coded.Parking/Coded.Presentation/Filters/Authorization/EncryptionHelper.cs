using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace Coded.Presentation.Filters.Authorization
{
    public static class EncryptionHelper
    {
        private static readonly byte[] _salt = { 0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef };
        private const string _encryptionPassword = "67%$k$!7?2";
        public static string Decrypt(string stringToDecrypt)
        {
            var algorithm = GetAlgorithm(_encryptionPassword);
            byte[] descryptedBytes;
            using (ICryptoTransform decryptor = algorithm.CreateDecryptor(algorithm.Key, algorithm.IV))
            {
                byte[] encryptedBytes = Convert.FromBase64String(stringToDecrypt);

                descryptedBytes = InMemoryCrypt(encryptedBytes, decryptor);
            }
            var decryptedString = Encoding.UTF8.GetString(descryptedBytes);
            return decryptedString;
        }

        public static string Encrypt(string stringToEncrypt)
        {
            //Response.Write("String to encrypt: " + stringToEncrypt + "<br/>");
            var algorithm = GetAlgorithm(_encryptionPassword);

            byte[] encryptedBytes;
            using (ICryptoTransform encryptor = algorithm.CreateEncryptor(algorithm.Key, algorithm.IV))
            {
                byte[] bytesToEncrypt = Encoding.UTF8.GetBytes(stringToEncrypt);
                //Response.Write("String to encrypt as bytearray: " + bytesToEncrypt + @"<br/>");

                encryptedBytes = InMemoryCrypt(bytesToEncrypt, encryptor);
            }

            var encryptedString = Convert.ToBase64String(encryptedBytes);
            //Response.Write("Encrypted string: " + encryptedString + @"<br/>");
            return encryptedString;
        }

        private static byte[] InMemoryCrypt(byte[] data, ICryptoTransform transform)
        {
            var memory = new MemoryStream();
            using (Stream stream = new CryptoStream(memory, transform, CryptoStreamMode.Write))
            {
                stream.Write(data, 0, data.Length);
            }
            return memory.ToArray();
        }

        private static RijndaelManaged GetAlgorithm(string encryptionPassword)
        {
            var key = new Rfc2898DeriveBytes(encryptionPassword, _salt);
            var algorithm = new RijndaelManaged();
            //algorithm.Padding = PaddingMode.ISO10126;
            algorithm.Key = key.GetBytes(algorithm.KeySize / 8);
            algorithm.IV = key.GetBytes(algorithm.BlockSize / 8);
            return algorithm;
        }

        
    }
}