namespace WebApplication3.Helpers
{
    public static class WktValidator
    {
        public static bool IsValidWkt(string wkt)
        {
            // Basit bir WKT doğrulama örneği
            return !string.IsNullOrEmpty(wkt) && wkt.StartsWith("POINT(") && wkt.EndsWith(")");
        }
    }
}