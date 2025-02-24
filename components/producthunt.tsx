import Link from "next/link";
const ProductHunt = () => {
  return (
    <Link href="https://www.producthunt.com/posts/hugfairy" target="_blank">
      <img
        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=907898&theme=light&t=1740387328263"
        alt="Hugfairy - Send&#0032;hugs&#0032;to&#0032;people&#0032;on&#0032;BlueSky | Product Hunt"
        height="54"
        width="250"
      ></img>
    </Link>
  );
};
export default ProductHunt;
