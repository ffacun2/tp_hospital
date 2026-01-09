export const formatToHTMLDate = (dateString: string | undefined) => {
   if (!dateString) return "";
   return dateString.split('T')[0];
};

export const formatToHTMLTime = (dateString: string | undefined) => {
   if (!dateString) return "";
   return dateString.split('T')[1];
};