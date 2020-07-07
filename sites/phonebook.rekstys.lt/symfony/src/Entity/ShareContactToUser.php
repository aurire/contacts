<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ShareContactToUserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Serializer\Annotation\SerializedName;

/**
 * @ApiResource(
 *     collectionOperations={
 *         "get" = {
 *
 *          },
 *         "post" = {
 *             "access_control",
 *             "validation_groups" = { "Default", "create"}
 *         }
 *
 *     },
 *     itemOperations={
 *         "get" = {
 *             "security" = "is_granted('ROLE_USER')"
 *         },
 *         "put" = {"security" = "is_granted('ROLE_USER') and object == user"},
 *         "delete" = {
 *             "security" = "is_granted('DELETE', object)",
 *             "security_message" = "only creator can delete share"
 *         }
 *     },
 *     normalizationContext={"groups"={"share:read"}},
 *     denormalizationContext={"groups"={"share:write"}}
 * )
 * @ORM\Table(
 *    name="share_contact_to_user",
 *    uniqueConstraints={
 *        @ORM\UniqueConstraint(name="share_unique", columns={"contact_id", "user_id"})
 *    }
 * )
 * @UniqueEntity(fields={"contact", "user"}, message="This contact is already shared with this user")
 * @ORM\Entity(repositoryClass=ShareContactToUserRepository::class)
 * @ApiFilter(SearchFilter::class, properties={"user": "exact"})
 */
class ShareContactToUser
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Contact::class, inversedBy="user")
     * @Groups({"share:write"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $contact;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="sharedContacts")
     * @Groups({"share:read", "share:write"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContact(): ?Contact
    {
        return $this->contact;
    }

    public function setContact(?Contact $contact): self
    {
        $this->contact = $contact;

        return $this;
    }

    /**
     * @Groups({"contacts:item:get"})
     */
    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @Groups({"user:item:get", "share:read"})
     * @SerializedName("contact")
     */
    public function getContactForUser()
    {
        return $this->contact;
    }

    /**
     * @Groups({"user:item:get", "share:read"})
     * @SerializedName("contactOwner")
     */
    public function getContactOwnerMail()
    {
        return $this->contact->getOwner()->getEmail();
    }
}
