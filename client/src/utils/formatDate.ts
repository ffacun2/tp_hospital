export const formatToHTMLDate = (dateString: string | undefined) => {
  if (!dateString) return "";
    return dateString.split('T')[0];
  };