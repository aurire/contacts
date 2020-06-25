<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ShareNoteToUserRepository;
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
 *    name="share_note_to_user",
 *    uniqueConstraints={
 *        @ORM\UniqueConstraint(name="share_unique", columns={"note_id", "user_id"})
 *    }
 * )
 * @UniqueEntity(fields={"note", "user"}, message="This note is already shared with this user")
 * @ORM\Entity(repositoryClass=ShareNoteToUserRepository::class)
 * @ApiFilter(SearchFilter::class, properties={"user": "exact"})
 */
class ShareNoteToUser
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Note::class, inversedBy="user")
     * @Groups({"share:write"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $note;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="sharedNotes")
     * @Groups({"share:read", "share:write"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNote(): ?Note
    {
        return $this->note;
    }

    public function setNote(?Note $note): self
    {
        $this->note = $note;

        return $this;
    }

    /**
     * @Groups({"notes:item:get"})
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
     * @SerializedName("note")
     */
    public function getNoteForUser()
    {
        return $this->note;
    }

    /**
     * @Groups({"user:item:get", "share:read"})
     * @SerializedName("noteOwner")
     */
    public function getNoteOwnerMail()
    {
        return $this->note->getOwner()->getEmail();
    }
}
