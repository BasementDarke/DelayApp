namespace DelayApi.Exceptions
{
    using System;

    public class JourneyException : Exception
    {
        public JourneyException()
        {
        }

        public JourneyException(string message)
            : base(message)
        {
        }

        public JourneyException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
