using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Helpers
{
    public class CustomJsonConverter : Newtonsoft.Json.JsonConverter
    {
        public override bool CanWrite { get { return false; } }
        private readonly Type[] _types;

        public CustomJsonConverter(params Type[] types)
        {
            _types = types;
        }

        public override void WriteJson(JsonWriter writer, object value, Newtonsoft.Json.JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, Newtonsoft.Json.JsonSerializer serializer)
        {
            var value = reader.Value.ToString().ToLower().Trim();
            switch (value)
            {
                case "true":
                case "yes":
                case "y":
                case "1":
                    return true;
            }
            return false;
        }

        public override bool CanConvert(Type objectType)
        {
            return _types.Any(t => t == objectType);
        }
    }
}