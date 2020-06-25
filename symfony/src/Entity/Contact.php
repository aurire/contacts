<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ContactRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\SerializedName;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Serializer\Filter\PropertyFilter;
use Symfony\Component\Validator\Constraints as Assert;
/**
 * @ApiResource(
 *     collectionOperations={
 *         "get"={
 *             "security"
 *         },
 *         "post"={
 *             "security"
 *         }
 *     },
 *     itemOperations={
 *         "get"={
 *             "normalization_context"={"groups"={"contacts:read", "contacts:item:get"}}
 *         },
 *         "put" = {
 *             "security" = "is_granted('EDIT', object)",
 *             "security_message" = "only creator can edit contact"
 *         },
 *         "delete" = { "security" = "is_granted('EDIT', object)", "security_message" = "only creator can delete contact" }
 *     },
 *     normalizationContext={"groups"={"contacts:read"}},
 *     denormalizationContext={"groups"={"contacts:write"}},
 *     attributes={
 *         "pagination_items_per_page"=5
 *     }
 * )
 *
 * @ORM\Entity(repositoryClass=ContactRepository::class)
 * @ApiFilter(BooleanFilter::class, properties={"isPublic"})
 * @ApiFilter(SearchFilter::class, properties={"owner": "exact", "name": "partial", "phone": "partial"})
 * @ApiFilter(PropertyFilter::class)
 */
class Contact
{

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->contactShares = new ArrayCollection();
    }

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"contacts:read", "contacts:write", "user:read", "user:write", "share:read"})
     * @Assert\NotBlank()
     * @Assert\Length(
     *     min=2,
     *     max=255,
     *     maxMessage="Max name length is 255 characters"
     * )
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"contacts:read", "user:read", "share:read"})
     * @Assert\NotBlank()
     * @Assert\Length(
     *     min=2,
     *     max=255,
     *     maxMessage="Max message length is 255 characters"
     * )
     */
    private $phone;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"contacts:read", "user:read", "share:read"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"contacts:read", "contacts:write", "user:write"})
     */
    private $isPublic;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="contacts")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"contacts:read", "contacts:write"})
     * @Assert\Valid()
     */
    private $owner;

    /**
     * @ORM\OneToMany(targetEntity=ShareContactToUser::class, mappedBy="contact", orphanRemoval=true)
     */
    private $contactShares;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @Groups("contacts:read")
     */
    public function getPhone(): ?string
    {
        return $this->phone;
    }

    /**
     * @Groups({"contacts:write", "user:write"})
     * @SerializedName("phone")
     */
    public function setPhone($phone): void
    {
        $this->phone = $phone;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function getIsPublic(): ?bool
    {
        return $this->isPublic;
    }

    public function setIsPublic(bool $isPublic = false): self
    {
        $this->isPublic = $isPublic;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): self
    {
        $this->owner = $owner;

        return $this;
    }

    /**
     * @Groups({"contacts:item:get"})
     */
    public function getContactShares(): Collection
    {
        return $this->contactShares;
    }

    public function addContactShare(ShareContactToUser $share): self
    {
        if (!$this->contactShares->contains($share)) {
            $this->contactShares[] = $share;
            $share->setContact($this);
        }

        return $this;
    }

    public function removeShare(ShareContactToUser $share): self
    {
        if ($this->contactShares->contains($share)) {
            $this->contactShares->removeElement($share);
            // set the owning side to null (unless already changed)
            if ($share->getContact() === $this) {
                $share->setContact(null);
            }
        }

        return $this;
    }
}
